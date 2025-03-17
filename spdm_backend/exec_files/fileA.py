import numpy as np
import pandas as pd


def main():

    res = []
    t = 0

    for n in range(steps):
        t += dt
        noise = np.random.normal(mu1, sigma1)
        z = core_calc(t, 1.0) + noise
        res.append(z)

    return np.max(res)


def core_calc(x: 'unit:s, type:float', y: 'unit:-, type:int') -> 'unit:V, type:float':

    z = y * np.sin(x)

    return z


if __name__ == '__main__':

    mu1 = 2.3
    sigma1 = 0.1

    dt = 0.1
    tmax = 5
    steps = int(tmax / dt)

    print(main())