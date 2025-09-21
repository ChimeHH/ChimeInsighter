import time
import json
import uuid
import pathlib
import psutil  

import traceback

from .pyrabbit.api import Client

from .config import AmqConfig
from .message import AmqMessage

from exlib.settings import osenv

from database import om_database

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class AmqQueue:
    H_PRI_Q = 0
    M_PRI_Q = 1
    L_PRI_Q = 2

    def __init__(self, vhost, exchange, host, port, username, password, qname, routekey):
        self._vhost = vhost
        self._exchange = exchange
        self._host = host
        self._port = port
        self._username = username
        self._password = password
        self._qname = qname        
        self._routekey = routekey
    
    @property
    def qname(self):
        return self._qname

    @property
    def routekey(self):
        return self._routekey

    @property
    def vhost(self):
        return self._vhost

    @property
    def exchange(self):
        return self._exchange

    @property
    def host(self):
        return self._host

    @property
    def port(self):
        return self._port

    @property
    def username(self):
        return self._username

    @property
    def password(self):
        return self._password

    def __str__(self):
        return f"{self.__class__.__name__}( {self.vhost}/{self.exchange} @{self.host}/{self.port}  {self.qname}/{self.routekey} )"

    def __repr__(self):
        return str(self)

class PollingHook:
    def __init__(self, function, *args, **kwargs):        
        pass
    def run(self, queue, message):
        raise Exception("NotImplemented")

class PollingTimeoutHook(PollingHook):
    def __init__(self, function, interval, last_timeout=0):
        self.function = function
        self.interval = interval
        self.last_timeout = 0

    def run(self):
        t_now = time.time()
        if t_now - self.last_timeout < self.interval:            
            return
        self.last_timeout = t_now
        self.function()

    def __str__(self):
        return f"{self.__class__.__name__} ( {self.function.__name__}, {self.interval}, {self.last_timeout} )"

    def __repr__(self):
        return str(self)



class AmqGeneral:
    class OverloadLevel:
        NONE = None # no overload
        LOW = 'low' # cpu overload
        MEDIUM = 'medium' # both cpu and memory overload
        HIGH = 'high' # all cpu, memory, swap overload

    def __init__(self, name, config_file=None):
        self.name = name        
        self.whoami = osenv.engine_id(self.name)
        self.start_time = time.time()

        log.setProcessName(self.name)

        self._config = AmqConfig(config_file)

        try_times = 0

        while True:
            try:
                try_times += 1

                client = Client(f'{self.host}:{self.port}', self.username, self.password)        
                while not client.is_alive():
                    log.info("rabbitmq server is down. waiting")
                    time.sleep(1)

                client.create_vhost(self.vhost)
                log.debug(f"all vhosts: {client.get_all_vhosts()}")
                log.debug(f"all vhost names: {client.get_vhost_names()}")

                client.set_vhost_permissions(self.vhost, self.username, '.*', '.*', '.*')

                client.create_exchange(self.vhost, self.exchange, 'direct')
                client.get_exchange(self.vhost, self.exchange)

                self.client = client
                break
            except:
                if try_times < 30:
                    log.warning(f"Failed to connect to RabbitMQ {try_times} times. will retry in 1 second.")
                    time.sleep(1)
                    continue

                raise

        self.previous_overload = self.OverloadLevel.NONE
    
        self.om = om_database.OmDatabase(self.name, self.whoami)        
    
    @property
    def om(self):
        return self._om_database
    
    @om.setter
    def om(self, value):
        self._om_database = value
        self._om_database.update_engine()

    @property
    def vhost(self):
        return self.config.vhost
    @property
    def exchange(self):
        return self.config.exchange
    @property
    def host(self):
        return self.config.host
    @property
    def port(self):
        return self.config.port
    @property
    def username(self):
        return self.config.username
    @property
    def password(self):
        return self.config.password
        
    def __validate__(self):
        from services.core.fingerprints import SignedLicense, ExpiredLicense, WrongLicenseFingerprint, WrongSignatureException, NoLicenseFound
        try:
            license = SignedLicense.load_license()        
            license.verify_not_expired()
            license.verify_fingerprint()
        except Exception as e:
            return {"reason": "no valid license found", "errstr": str(e)} 
        
    def create_queue(self, qname, routekey):
        self.client.create_queue(self.vhost, qname)
        self.client.create_binding(self.vhost, self.exchange, qname, routekey)
        return AmqQueue(self.vhost, self.exchange, self.host, self.port, self.username, self.password, qname, routekey)

    def queue_obj(self, qname, routekey):
        return AmqQueue(self.vhost, self.exchange, self.host, self.port, self.username, self.password, qname, routekey)

    @property
    def config(self):
        return self._config

    def publish(self, q_obj, message):        
        self.client.publish(q_obj.vhost, q_obj.exchange, q_obj.routekey, message.encode())

    @classmethod
    def publish_ex(cls, q_obj, message):
        client = Client(f'{q_obj.host}:{q_obj.port}', q_obj.username, q_obj.password)        
        while not client.is_alive():
            log.info("rabbitmq server is down. waiting")
            time.sleep(1)

        client.publish(q_obj.vhost, q_obj.exchange, q_obj.routekey, message.encode())

    def get_message(self, queue, ackmode='ack_requeue_false'):
        try:
            messages = self.client.get_messages(self.vhost, queue.qname, count=1, ackmode=ackmode)            
        except Exception as e:
            log.warning(f"client.get_messages raised {str(e)}")
            return None

        return messages[0] if messages else None

    def get_messages(self, q_obj, count=1, ackmode='ack_requeue_false'):
        messages = self.client.get_messages(q_obj.vhost, q_obj.qname, count=count, ackmode=ackmode)
        # if messages:
        #     log.debug(f"Received {queue}, {messages}")
        return messages

    def on_message(self, queue, message):
        # log.debug(f"received queue: {queue} message: {message}")
        amsg = AmqMessage.from_payload(message['payload']) 
        # log.debug(amsg)       

    def on_empty(self, queue=None):
        if not queue:
            time.sleep(1)

    def is_ready(self):
        if self.get_overload_level():
            return False

        return True

    def get_overload_level(self, memory_used_threshold=0, swap_used_threshold=0, cpu_used_threshold=0):
        if not memory_used_threshold:
            memory_used_threshold = self.config.memory_used_threshold
        if not swap_used_threshold:
            swap_used_threshold = self.config.swap_used_threshold
        if not cpu_used_threshold:
            cpu_used_threshold = self.config.cpu_used_threshold

        status = self.om.get_engine_status()
        
        cpu_used = float(status.get('cpu_used', 0))
        memory_used = float(status.get('memory_used', 0))
        swap_used = float(status.get('swap_used', 0))

        level = None

        if (swap_used > swap_used_threshold):
            level = self.OverloadLevel.HIGH
        elif (memory_used > memory_used_threshold):
            level = self.OverloadLevel.MEDIUM
        elif (cpu_used > cpu_used_threshold): 
            level = self.OverloadLevel.LOW

        if self.previous_overload != level:
            log.warning(f"Overload status changed, from {self.previous_overload} to {level}")
        
        self.previous_overload = level

        return level

    def post_call(self, queue, message):
        return True
    
    def update_status(self):
        self.om.update_engine()

    def consume_task(self, prioritized_queues, polling_hooks=[]):
        while True:
            try:
                # to handle timeout events
                for p in polling_hooks:
                    # log.debug(f"call polling hook {p}")
                    p.run()

                # check whether the previous work was done
                if not self.is_ready():
                    time.sleep(0.5)
                    continue

                consumed_message = False
                for queue in prioritized_queues:

                    # the previous work was done, then get the next message
                    message = self.get_message(queue)
                    if not message:
                        self.on_empty(queue)
                        continue

                    try:
                        consumed_message = True
                        self.on_message(queue, message)
                        break

                    except Exception as e:
                        if 'payload' in message:
                            message['payload'] = message['payload'][:64] + '...' + message['payload'][-32:]

                        log.warning(f"failed to handle message: {message}")
                        log.exception(f"failed to handle message: {message}") 

                    self.post_call(queue, message)

                if not consumed_message:
                    self.on_empty() # queue=None means all prioritized_queues are empty

            except KeyboardInterrupt:
                log.warning("quit on control-c")
                break
            except TimeoutError:
                continue
            except Exception as e:
                log.exception(f"got an exception: {e}") 
                

    def delete_binding(self, q_obj):
        self.client.delete_binding(q_obj.vhost, self.exchange, q_obj.qname, q_obj.routekey)

    def delete_queue(self, q_obj):
        self.client.delete_queue(q_obj.vhost, q_obj.qname)

    def release(self):
        self.client.delete_vhost(self.vhost)

    def kickoff(self):
        interval = 60
        update_status = PollingTimeoutHook(self.update_status, interval)
        self.consume_task(self.in_queues, polling_hooks=(update_status, ))

    def cleanup_queues(self):
        count = 0
        for queue in self.in_queues:
            while True:
                message = self.get_message(queue)
                if not message:
                    break
                count += 1
        log.debug(f"cleanup dropped {count} messages")


if __name__ == "__main__":
    import click
    import sys

    middle_pri_q = ('sast.highpri', "sast.highpri.rk")
    high_pri_q = ('sast.middlepri', 'sast.middlepri.rk')

    @click.group()
    def app():
        pass

    @app.command(short_help='create a publisher task')    
    def publisher():
        sim = AmqGeneral('unittest')    

        sim.in_queues = []
        sim.out_queues = []
        for queue in sim.config.sastQueues:
            sim.out_queues.append(AmqQueue(sim.vhost, sim.exchange, sim.host, sim.port, sim.username, sim.password, sim.config.sastQueues[1]['queue'], sim.config.sastQueues[1]['routekey']))

        for i in range(100):
            sim.publish(sim.out_queues[1], AmqMessage('TEST', text=f'"this is a middle priority message: {i}"').request(sim.name))
            time.sleep(.5)

    @app.command(short_help='create an  expublisher task')    
    def expublisher():  
        config = AmqConfig()      

        outq = AmqQueue(config.vhost, config.exchange, config.host, config.port, config.username, config.password, config.sastQueues[1]['queue'], config.sastQueues[1]['routekey'])
        for i in range(1):
            AmqGeneral.publish_ex(outq, AmqMessage('TEST', text=f'"this is a middle priority message: {i}"').request('simple'))

    @app.command(short_help='create a consumer task')    
    def consumer():
        sim = AmqGeneral('unittest')
        sim.in_queues = []
        for q in sim.config.sastQueues:
            print(q)
            sim.in_queues.append(sim.create_queue(q['queue'], routekey=q['routekey']))
        sim.consume_task(sim.in_queues)

    app()
