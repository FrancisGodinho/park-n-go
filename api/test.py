import math

window = [1, 4, 7, 4, 1, 4, 16, 26, 16, 4, 7, 26, 41, 26, 7, 4, 16, 26, 16, 4, 1, 4, 7, 4, 1]

def software_dot_product(img, win=window):
    def dot(a1: list, a2: list):
        dres = 0
        for x, y in zip(a1, a2):
            dres += x * y
        return dres
    win_len = int(math.sqrt(len(win)))
    out = [[0 for j in range(len(img[0]) - win_len + 1)] for i in range(len(img) - win_len + 1)]
    for i in range(0, len(img) - win_len + 1):
        for j in range(0, len(img[0]) - win_len + 1):
            curr_img = [0 for t in range(len(win))]
            for p in range(i, i + win_len):
                for q in range(j, j + win_len):
                    curr_img[(p - i) * win_len + (q - j)] = img[p][q]

            out[i][j] = dot(curr_img, win)

    return out

if __name__ == "__main__":
    img = [[1, 2, 3, 4], [4, 5, 6, 4], [7, 8, 9, 4]]
    win = [1, 1, 1, 1, 1, 1, 1, 1, 1]
    print(software_dot_product(img, win))


