import os
from skimage.segmentation import clear_border
import pytesseract
import numpy as np
import imutils
from imutils import paths
import cv2

# from gaussian_blur import gaussian_blur

class ALPR:
    def __init__(self, minAR=2, maxAR=6, debug=False):
        # stores min and max aspect ratios for license plates
        # debug determines whether or not to display intermediate results
        self.minAR = minAR
        self.maxAR = maxAR
        self.debug = debug
        
    def debug_imshow(self, title, image, waitKey=False):
        # show the image with title if in debug mode
        if self.debug:
            cv2.imshow(title, image)
            
            # check to see if we should wait for keypress
            if waitKey:
                cv2.waitKey(0)

    def image_processing_gauss(self):
        # perform blackhat morphological operation (reveal dark regions on light background)
        # ie license plates
        rectKern = cv2.getStructuringElement(cv2.MORPH_RECT, (13, 5))
        blackhat = cv2.morphologyEx(self.gray, cv2.MORPH_BLACKHAT, rectKern)
        self.debug_imshow("Blackhat", blackhat)
        
        # find regions in image that are light
        # we clean up the image by filling small holes (black regions) with white
        # in order to get a large white region for the license plate
        squareKern = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        light = cv2.morphologyEx(self.gray, cv2.MORPH_CLOSE, squareKern)
        self.light = cv2.threshold(light, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
        self.debug_imshow("Light regions", self.light)
        
        # compute gradient of blackhat image in x direction which 
        # should emphasize the characters on thelicense plate
        gradX = cv2.Sobel(blackhat, ddepth=cv2.CV_32F, dx=1, dy=0, ksize=-1)
        gradX = np.absolute(gradX)
        (minVal, maxVal) = (np.min(gradX), np.max(gradX))
        gradX = 255 * ((gradX - minVal) / (maxVal - minVal))
        gradX = gradX.astype("uint8")
        self.debug_imshow("Scharr", gradX)
        self.gauss = cv2.GaussianBlur(gradX, (5, 5), 0)
        return gradX
                
    def locate_license_plate_candidates(self, gradX, keep=5):
        gradX = self.gauss
        rectKern = cv2.getStructuringElement(cv2.MORPH_RECT, (17, 4))
        # blur the gradient representation, applying a closing operation,
        # and threshold the image using Otsu's method
        gradX = cv2.morphologyEx(gradX, cv2.MORPH_CLOSE, rectKern)
        thresh = cv2.threshold(gradX, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
        self.debug_imshow("Grad Thresh", thresh)
        
        # perform a series of erosions and dilations to clean up the image
        thresh = cv2.erode(thresh, None, iterations=2)
        thresh = cv2.dilate(thresh, None, iterations=2)
        self.debug_imshow("Grad Erode/Dilate", thresh)
        
        # Take bitwise AND of threshold result and light region of the image
        # thresh = cv2.bitwise_and(thresh, thresh, mask=self.light)
        thresh = cv2.dilate(thresh, None, iterations=2)
        thresh = cv2.erode(thresh, None, iterations=1)
        self.debug_imshow("Final", thresh, waitKey=True)
        
        # find contours in threshold image and sort by size in descending order, 
        # keeping only largest ones
        cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        cnts = imutils.grab_contours(cnts)
        cnts = sorted(cnts, key=cv2.contourArea, reverse=True)[:keep]
        
        return cnts
    
    def locate_license_plate(self, candidates, clearBorder=True, pad=5):
        # initialize license plate contour and region of interest (ROI)
        lpCnt = None
        roi = None
        img_h, img_w = self.gray.shape
        
        # loop over the license plate candidate contours
        for c in candidates:
            # compute the bounding box of the contour then use the bounding box to derive the aspect ratio
            (x, y, w, h) = cv2.boundingRect(c)
            ar = w / float(h)
            
            # check to see if aspect ratio matches that of license plates
            if ar >= self.minAR and ar <= self.maxAR:
                # store the license plate contour and extract the license 
                # plate from the grayscale image and then threshold it
                lpCnt = c
                licensePlate = self.gray[max(y - pad, 0):min(y + h + pad, img_h), max(x - pad, 0):min(x + w + 2*pad, img_w)]
                roi = cv2.threshold(licensePlate, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
                
                # check to see if we should clear any pixels touching the border, 
                # which is typically noise
                if clearBorder:
                    roi = clear_border(roi)
                    
                # break early sine we have already found license plate region
                self.debug_imshow("License Plate", licensePlate)
                self.debug_imshow("ROI", roi, waitKey=True)
                break
        
        # return license plate ROI and contour associated
        return (roi, lpCnt)
    
    def build_tesseract_options(self, psm=7):
        # PSM mode 7: treat the image as single text line
        # tell tesseract to OCR only alphanumeric characters
        alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        options = f"-c tessedit_char_whitelist={alphanumeric}"
        
        # set the PSM mode
        options += f" --psm {psm}"
        
        return options

    def get_gauss_image(self):
        # convert image to grayscale, locate all potential licesne plate locations, 
        # process the candidates and return actual license plate
        gauss_image = self.image_processing_gauss()
        return gauss_image
                
def cleanup_text(text):
    # strip out non-ASCII text to draw text on image using OpenCV
    return "".join([c if ord(c) < 128 else "" for c in text]).strip()

def main():
    lpText = None
    alpr = ALPR(debug=False)
    for image_name in sorted(os.listdir('images__/')):
        if image_name == '.DS_Store':
            continue
        print(image_name)
        image = cv2.imread('images__/' + image_name)
        image = imutils.resize(image, width=250)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        alpr.gray = gray
        res = alpr.get_gauss_image()
        # gauss
        image = cv2.GaussianBlur(res, (5, 5), 0)
        # gauss
        candidates = alpr.locate_license_plate_candidates(image)
        (lp, lpCnt) = alpr.locate_license_plate(candidates, clearBorder=False)
        # only OCR the license plate if the license plate ROI is not empty
        if lp is not None:
            # OCR the license plate
            # lp = imutils.resize(lp, width=200)
            options = alpr.build_tesseract_options(psm=7)
            lpText = pytesseract.image_to_string(lp, config=options)
            print(lpText)
            alpr.debug_imshow("License Plate", lp)
        if lpText is None or lpText == '':
            print("No Plate")


def main_single():
    lpText = None
    alpr = ALPR(debug=True)
    image = cv2.imread('images__/9.png')
    image = imutils.resize(image, width=250)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    alpr.gray = gray
    res = alpr.get_gauss_image()
    # gauss
    image = cv2.GaussianBlur(res, (5, 5), 0)
    # gauss
    candidates = alpr.locate_license_plate_candidates(image)
    (lp, lpCnt) = alpr.locate_license_plate(candidates, clearBorder=False)
    # only OCR the license plate if the license plate ROI is not empty
    if lp is not None:
        # OCR the license plate
        # lp = imutils.resize(lp, width=3250)
        options = alpr.build_tesseract_options(psm=13)
        lpText = pytesseract.image_to_string(lp, config=options)
        print(lpText)
        alpr.debug_imshow("License Plate", lp)
    if lpText is None or lpText == '':
        print("No Plate")

# if __name__ == "__main__":
#     main()
#     # main_single()