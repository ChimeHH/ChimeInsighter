import pathlib
import pickle
from pprint import pp

def load(f):
    return pickle.load(f)

def dump(f, *data):
    for v in data:
        pickle.dump(v, f)

def loadall(filepath):
    with filepath.open("rb") as f:
        while True:
            try:
                yield pickle.load(f)
            except EOFError:
                break

def dumpall(filepath, *data):
    with filepath.open("wb") as f:
        for v in data:
            pickle.dump(v, f)


if __name__=="__main__":
    filepath = pathlib.Path("/tmp/test_pickleex.pkl")

    with filepath.open("wb") as f:
        dump(f, dict(a=1, b=2, c=3))
        dump(f, [1, 3, 5, 7, 9])
        dump(f, (2,4, 6, 8, 10))

    data = loadall(filepath)
    for i, v in enumerate(data):
        print(f"record {i}::")
        pp(v)
