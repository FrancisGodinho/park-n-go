import math
import numpy as np
import cv2

def gaussian_blur(image):
    k = 15
    h, w = image.shape
    image_pad = np.pad(image, int(k/2))
    kernel = gkern(k, 2)
    kernel_flat = kernel.flatten()
    print(image_pad[int(k/2):h+int(k/2), int(k/2):w+int(k/2)])
    ret_array = np.zeros((h, w))
    for col_i, i in enumerate(range(int(k/2), h + int(k/2))):
        row = np.zeros(w)
        for row_i, j in enumerate(range(int(k/2), w + int(k/2))):
            # create sub-array of size k by k centered at (i, j), flatten to convolve
            sub_array_flat = image_pad[i - int(k/2):i + int(k/2) + 1, j - int(k/2):j + int(k/2) + 1].flatten()
            row[row_i] = kernel_flat@sub_array_flat
        ret_array[col_i] = row
    image_cv = cv2.GaussianBlur(image, (k, k), 0)
    print(ret_array[int(k/2):h+int(k/2), int(k/2):w+int(k/2)])
    print(image_cv)
    cv2.imshow("Blur", ret_array .astype('uint8'))
    cv2.imshow("CV", image_cv)
    cv2.waitKey(0)
    return ret_array

def gkern(k=5, sig=1):
    """\
    creates gaussian kernel with side length `k` and a sigma of `sig`
    """
    ax = np.linspace(-(k - 1) / 2., (k - 1) / 2., k)
    gauss = np.exp(-0.5 * np.square(ax) / np.square(sig))
    kernel = np.outer(gauss, gauss)
    return kernel / np.sum(kernel)


def hardware_acc():
    pass


image = cv2.imread('./images__/0.png', cv2.IMREAD_GRAYSCALE)
gaussian_blur(image)