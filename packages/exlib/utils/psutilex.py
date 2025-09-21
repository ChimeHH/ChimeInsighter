import psutil
import time

DEFAULT_TIMEOUT = 30


def kill_process_tree(process, timeout=DEFAULT_TIMEOUT):
    """
    Kills the process and all of it's children

    :param process: The process (Popen object from psutil) to kill
    :param timeout: Timeout in seconds to wait for the killed processes
    """
    to_wait = []

    try:
        children = process.children(recursive=True)

        for child in children:
            try:
                child.kill()
                to_wait.append(child)
            except psutil.NoSuchProcess:
                pass

        process.kill()
        to_wait.append(process)
    except psutil.NoSuchProcess:
        pass
    finally:
        if to_wait:
            psutil.wait_procs(to_wait, timeout=timeout)


def wait_processes(scan_queue, processes, interval=1, timeout=60, timeout_total=3600*100):
    ''' note, scan_queue should be Manager().Queue() instead of multiprocessing.Queue(), otherwise users must clean the queue '''
    timeout_interval = 0
    last_qsize = 0
    while True:
        if not any(p.is_alive() for p in processes):
            return scan_queue.qsize()

        current_qsize = scan_queue.qsize()
        if last_qsize == current_qsize:
            timeout_interval += interval
            if timeout_interval >= timeout:
                count = 0
                for p in processes:                    
                    if p.is_alive():
                        count += 1
                        p.terminate()
                        p.join()
                return -count
        else:
            last_qsize = current_qsize
            timeout_interval = 0                

        time.sleep(interval)
        timeout_total -= interval