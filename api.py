from requester import make_request
from precache import apicache
from config import *

def get_error_code(error):
    return int(error[11:14]) #Ugly

def get_command(verb, subject):
    commandlist = apicache.get(verb, None)
    if commandlist is not None:
        command = commandlist.get(subject, None)
        if command is not None:
            return command["name"]
    return None

def apicall(verb, subject, data):
    command = get_command(verb, subject)
    response, error = make_request(command, data, None, host, port, apikey, secretkey, protocol, path)
    if error is not None:
        return error, get_error_code(error)
    return response
