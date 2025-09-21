import re
import pathlib
from pprint import pprint

from exlib.utils import jsonex
from exlib.settings import osenv

from .plugins.linux_kernel_parameters_misconfiguration import LinuxKernelParametersMisconfiguration
from .plugins.linux_password_misconfiguration import LinuxPasswordPolicyMisconfiguration
from .plugins.ssh_misconfiguration import SSHConfigMisconfiguration
from .plugins.web_server_misconfiguration import ApacheWebServerMisconfiurations
from .plugins.windows_registry_misconfigurations import WindowsRegistryMisconfigurations
import collections

from exlib.concurrent.context import WorkerResult
from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)


def linux_kernel(context):
    try:
        identifier = LinuxKernelParametersMisconfiguration()
        ms = identifier.get_misconfigurations(str(context.filepath))
        if ms:
            results = [ m.to_dict() for m in ms ]        
            return WorkerResult(context, {'linux_kernel': results})

    except Exception as e:
        errstr = f"Misconfiguration failed to scan {context.version_id}: {context.filepath}, reason: {e}"
        log.exception(errstr)
        return -1

    return 0


def linux_password(context):
    try:
        identifier = LinuxPasswordPolicyMisconfiguration()
        ms =  identifier.get_misconfigurations(str(context.filepath))
        if ms:
            results = [ m.to_dict() for m in ms ]   
            return WorkerResult(context, {'linux_password': results})
            
    except Exception as e:
        errstr = f"Misconfiguration failed to scan {context.version_id}: {context.filepath}, reason: {e}"
        log.exception(errstr)
        return -1

    return 0


def ssh(context):
    try:
        identifier = SSHConfigMisconfiguration()
        ms =  identifier.get_misconfigurations(str(context.filepath))
        if ms:
            results = [ m.to_dict() for m in ms ]   
            return WorkerResult(context, {'ssh': results}) 
            
    except Exception as e:
        errstr = f"Misconfiguration failed to scan {context.version_id}: {context.filepath}, reason: {e}"
        log.exception(errstr)
        return -1

    return 0



def web_server(context):
    try:
        identifier = ApacheWebServerMisconfiurations()
        ms =  identifier.get_misconfigurations(str(context.filepath))
        if ms:
            results = [ m.to_dict() for m in ms ]               
            return WorkerResult(context, {'web_server': results})
            
    except Exception as e:
        errstr = f"Misconfiguration failed to scan {context.version_id}: {context.filepath}, reason: {e}"
        log.exception(errstr)
        return -1

    return 0


def win_registry(context):
    try:
        identifier = WindowsRegistryMisconfigurations()
        ms =  identifier.get_misconfigurations(str(context.filepath))
        if ms:
            results = [ m.to_dict() for m in ms ]   
            return WorkerResult(context, {'win_registry': results})

    except Exception as e:
        errstr = f"Misconfiguration failed to scan {context.version_id}: {context.filepath}, reason: {e}"
        log.exception(errstr)
        return -1

    return 0


if __name__ == '__main__':    
    import click
    import addict

    from exlib.utils.pathsearch import PathSearch
    
    @click.group()
    def app():
        pass

    @app.command(short_help='test scan command')
    @click.argument('operation', type=click.Choice(["linux_kernel", "linux_password", "ssh", "web_server", "win_registry"]))    
    @click.argument('filepath', type=click.Path(path_type=pathlib.Path, exists=True), default=pathlib.Path("/share/simple-test/output/integration-test-quick/configurations/"))
    def test(operation, filepath):
        context = addict.Addict()
        context.msgid = None
        all_files = PathSearch.AllFiles(filepath)

        for p in all_files:
            
            context.reports = {}
            context.filepath = p      

            eval(operation)(context)
            if context.reports:
                print("report {}".format(p))
                for category, threats in context.reports.items():
                    for threat in threats:
                        print(threat.to_dict())

    app()



'''
digitaltwins@9fb3905165c7:/share/simple-test/output$ python -m services.iast.misconfiguration.identifier integration-test-quick/configurations/
The misconfigurations from integration-test-quick/configurations/kernel/ common root
Misconfigurations for KernelLoadMisconfigurations
The loading paths that cased the misconfigurations found in ['integration-test-quick/configurations/kernel/run/sysctl.d/sysctl.conf', 'integration-test-quick/configurations/kernel/etc/sysctl.conf']:
{'misconfiguration_category': 'ASLR', 'prop': 'kernel.randomize_va_space', 'actual_value': '4', 'required_value': '1|2'}
{'misconfiguration_category': 'ExecShield Protection', 'prop': 'kernel.exec-shield', 'actual_value': None, 'required_value': '1'}
{'misconfiguration_category': 'ICMP Broadcast', 'prop': 'net.ipv4.icmp_echo_ignore_broadcasts', 'actual_value': None, 'required_value': '1'}
{'misconfiguration_category': 'ICMP Broadcast', 'prop': 'net.ipv4.icmp_ignore_bogus_error_messages', 'actual_value': None, 'required_value': '1'}
{'misconfiguration_category': 'IP Source Routing Packets', 'prop': 'net.ipv4.conf.all.accept_source_route', 'actual_value': None, 'required_value': '0'}
{'misconfiguration_category': 'IP Source Routing Packets', 'prop': 'net.ipv6.conf.all.accept_source_route', 'actual_value': None, 'required_value': '0'}
{'misconfiguration_category': 'IP Reverse Path Forwarding', 'prop': 'net.ipv4.conf.default.rp_filter', 'actual_value': None, 'required_value': '1|2'}
{'misconfiguration_category': 'IP Reverse Path Forwarding', 'prop': 'net.ipv6.conf.default.rp_filter', 'actual_value': None, 'required_value': '1|2'}
{'misconfiguration_category': 'IP Reverse Path Forwarding', 'prop': 'net.ipv4.conf.all.rp_filter', 'actual_value': None, 'required_value': '1|2'}
{'misconfiguration_category': 'IP Reverse Path Forwarding', 'prop': 'net.ipv6.conf.all.rp_filter', 'actual_value': None, 'required_value': '1|2'}
{'misconfiguration_category': 'Kernel SysRQ', 'prop': 'kernel.sysrq', 'actual_value': None, 'required_value': '0'}



The misconfigurations from integration-test-quick/configurations/os/ common root
Misconfigurations for PasswordPolicyMisconfigurations
The loading paths that cased the misconfigurations found in ['integration-test-quick/configurations/os/etc/login.defs', 'integration-test-quick/configurations/os/etc/pam.d/common-password']:
{'misconfiguration_category': 'Weak Check Against Previous Passwords', 'mechanism': 'pam_unix', 'prop': 'remember', 'actual_value': None, 'required_value': '10'}
{'misconfiguration_category': 'Weak Password', 'mechanism': 'pam_cracklib|pam_pwquality', 'prop': 'minlen', 'actual_value': None, 'required_value': '6'}



The misconfigurations from integration-test-quick/configurations/ssh/ common root
Misconfigurations for SSHMisconfigurations
The loading paths that cased the misconfigurations found in ['integration-test-quick/configurations/ssh/etc/ssh/sshd_config']:
{'misconfiguration_category': 'Deprecated Protocol', 'prop': 'Protocol', 'actual_value': '1', 'required_value': '2'}
{'misconfiguration_category': 'Default Port', 'prop': 'Port', 'actual_value': '22', 'required_value': 'not 22'}
{'misconfiguration_category': 'White\\Black List Users\\Groups', 'prop': 'DENYUSERS|ALLOWUSERS|DENYGROUPS|ALLOWGROUPS', 'actual_value': None, 'required_value': 'users/group names'}



The misconfigurations from integration-test-quick/configurations/web/ common root
Misconfigurations for ApacheWebServerMisconfigurations
Web Server type for misconfigurations : Apache
The loading paths that cased the misconfigurations found in ['integration-test-quick/configurations/web/etc/apache2/apache2.conf']:
{'misconfiguration_category': 'ClickJacking', 'prop': 'Header X-Frame-Options', 'actual_value': None, 'required_value': 'sameorigin|none'}
'''

