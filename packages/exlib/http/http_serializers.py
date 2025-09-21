from abc import abstractmethod
import pickle
import msgpack


class HttpResponseSerializer(object):

    @abstractmethod
    def pack(self, obj):
        raise NotImplementedError

    @abstractmethod
    def unpack(self, packed_obj):
        raise NotImplementedError


class MsgPackPickleSerializer(HttpResponseSerializer):
    def pack(self, obj):
        return msgpack.packb(pickle.dumps(obj), use_bin_type=True)

    def unpack(self, packed_obj):
        return pickle.loads(msgpack.unpackb(packed_obj, raw=False))
