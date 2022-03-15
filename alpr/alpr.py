from skimage.segmentation import clear_border
import pytesseract
import numpy as np
import imutils
from imutils import paths
import cv2

from gaussian_blur import gaussian_blur

class ALPR:
    def __init__(self, minAR=2, maxAR=5, debug=False):
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
                
    def locate_license_plate_candidates(self, gray, keep=5):
        # perform blackhat morphological operation (reveal dark regions on light background)
        # ie license plates
        rectKern = cv2.getStructuringElement(cv2.MORPH_RECT, (13, 5))
        blackhat = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, rectKern)
        self.debug_imshow("Blackhat", blackhat)
        
        # find regions in image that are light
        # we clean up the image by filling small holes (black regions) with white
        # in order to get a large white region for the license plate
        squareKern = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        light = cv2.morphologyEx(gray, cv2.MORPH_CLOSE, squareKern)
        light = cv2.threshold(light, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
        self.debug_imshow("Light regions", light)
        
        # compute gradient of blackhat image in x direction which 
        # should emphasize the characters on thelicense plate
        gradX = cv2.Sobel(blackhat, ddepth=cv2.CV_32F, dx=1, dy=0, ksize=-1)
        gradX = np.absolute(gradX)
        (minVal, maxVal) = (np.min(gradX), np.max(gradX))
        gradX = 255 * ((gradX - minVal) / (maxVal - minVal))
        gradX = gradX.astype("uint8")
        self.debug_imshow("Scharr", gradX)
        
        # blur the gradient representation, applying a closing operation,
        # and threshold the image using Otsu's method
        gradX = cv2.GaussianBlur(gradX, (5, 5), 0)
        gradX = cv2.morphologyEx(gradX, cv2.MORPH_CLOSE, rectKern)
        thresh = cv2.threshold(gradX, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
        self.debug_imshow("Grad Thresh", thresh)
        
        # perform a series of erosions and dilations to clean up the image
        thresh = cv2.erode(thresh, None, iterations=2)
        thresh = cv2.dilate(thresh, None, iterations=2)
        self.debug_imshow("Grad Erode/Dilate", thresh)
        
        # Take bitwise AND of threshold result and light region of the image
        thresh = cv2.bitwise_and(thresh, thresh, mask=light)
        thresh = cv2.dilate(thresh, None, iterations=2)
        thresh = cv2.erode(thresh, None, iterations=1)
        self.debug_imshow("Final", thresh, waitKey=True)
        
        # find contours in threshold image and sort by size in descending order, 
        # keeping only largest ones
        cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        cnts = imutils.grab_contours(cnts)
        cnts = sorted(cnts, key=cv2.contourArea, reverse=True)[:keep]
        
        return cnts
    
    def locate_license_plate(self, gray, candidates, clearBorder=False):
        # initialize license plate contour and region of interest (ROI)
        lpCnt = None
        roi = None
        
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
                licensePlate = gray[y:y + h, x:x + w]
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
                
    def find_and_ocr(self, image, psm=7, clearBorder=False):
        # initialize license plate text
        lpText = None
        
        # convert image to grayscale, locate all potential licesne plate locations, 
        # process the candidates and return actual license plate
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        candidates = self.locate_license_plate_candidates(gray)
        (lp, lpCnt) = self.locate_license_plate(gray, candidates, clearBorder=clearBorder)
        
        # only OCR the license plate if the license plate ROI is not empty
        if lp is not None:
            # OCR the license plate
            options = self.build_tesseract_options(psm=psm)
            lpText = pytesseract.image_to_string(lp, config=options)
            self.debug_imshow("License Plate", lp)
            
        # return OCR'd license plate text and the contour associated with the license plate region
        return (lpText, lpCnt)

def cleanup_text(text):
    # strip out non-ASCII text to draw text on image using OpenCV
    return "".join([c if ord(c) < 128 else "" for c in text]).strip()

alpr = ALPR(debug=False)

def get_lp(image):
    images = [
        imutils.resize(image, width=600),
        imutils.resize(image, width=500),
        imutils.resize(image, width=400),
        imutils.resize(image, width=300),
        imutils.resize(image, width=200),
    ]

    for image in images:
        # Apply automatic license plate recognition
        (lpText, lpCnt) = alpr.find_and_ocr(image)
        
        # only continue if license plate successfully OCR'd
        if lpText is not None and lpCnt is not None:
            # fit bounding box to license plate contour and draw bounding box on license plate
            box = cv2.boxPoints(cv2.minAreaRect(lpCnt))
            box = box.astype("int")
            cv2.drawContours(image, [box], -1, (0, 255, 0), 2)
            
            # compute unrotated bounding box for the license plate and draw OCR'd license plate text on the image
            (x, y, w, h) = cv2.boundingRect(lpCnt)
            print(x, y, w, h)
            cv2.putText(image, cleanup_text(lpText), (x, y - 15), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 0), 2)
            
            # show the output ANPR image
            print(lpText)
            cv2.imshow("Test", image)
            cv2.waitKey(0)
        else:
            print("None")

image = cv2.imread('./images__/1.png')
get_lp(image)


def get_lp_dir(dir="./images/"):
    imagePaths = sorted(list(paths.list_images(dir)))

    for imagePath in imagePaths:
        # Load image and resize
        image = cv2.imread(imagePath)
        image = imutils.resize(image, width=600)
        
        # Apply automatic license plate recognition
        (lpText, lpCnt) = alpr.find_and_ocr(image)
        
        # only continue if license plate successfully OCR'd
        if lpText is not None and lpCnt is not None:
            # fit bounding box to license plate contour and draw bounding box on license plate
            box = cv2.boxPoints(cv2.minAreaRect(lpCnt))
            box = box.astype("int")
            cv2.drawContours(image, [box], -1, (0, 255, 0), 2)
            
            # compute unrotated bounding box for the license plate and draw OCR'd license plate text on the image
            (x, y, w, h) = cv2.boundingRect(lpCnt)
            cv2.putText(image, cleanup_text(lpText), (x, y - 15), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 0), 2)
            
            # show the output ANPR image
            print(f"[{imagePath}] {lpText}")
            cv2.imshow(f"{imagePath}", image)
            cv2.waitKey(0)