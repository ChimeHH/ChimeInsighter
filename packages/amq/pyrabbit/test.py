import time
from .api import Client

def new_client():
    cl = Client('rabbitmq:15672', 'digitaltwins', '29bd161181234fccd35fcdc5ad5a60db')
    print(f"client: {cl}")
    print(f"is_alive: {cl.is_alive()}")

    cl.create_vhost('example_vhost')
    print(f"all vhosts: {cl.get_all_vhosts()}")
    print(f"all vhost names: {cl.get_vhost_names()}")

    cl.set_vhost_permissions('example_vhost', 'digitaltwins', '.*', '.*', '.*')

    cl.create_exchange('example_vhost', 'example_exchange', 'direct')
    cl.get_exchange('example_vhost', 'example_exchange')
    cl.create_queue('example_vhost', 'example_queue')
    cl.create_binding('example_vhost', 'example_exchange', 'example_queue', 'my.rtkey')

    return cl

def publish(cl):
    for i in range(1000):
        cl.publish('example_vhost', 'example_exchange', 'my.rtkey', f'example message payload {i}')

def consume(cl):
    while True:
        messages = cl.get_messages('example_vhost', 'example_queue', count=1, ackmode='ack_requeue_false')
        if not messages:
            time.sleep(2)
            print('No messages')
            continue

        for message in messages:
            print(f"queue depth: {message['message_count']}")
            print(f"{message}")
            time.sleep(1)
        

def release(cl):
    cl.delete_vhost('example_vhost')

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    
    parser.add_argument('--publish', action='store_true')
    parser.add_argument('--consume', action='store_true')
    parser.add_argument('--release', action='store_true')

    args = parser.parse_args()

    cl = new_client()
    if args.publish:
        publish(cl)

    if args.consume:
        consume(cl)

    if args.release:
        release(cl)
