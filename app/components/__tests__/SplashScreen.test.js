import React from "react";
import renderer from "react-test-renderer";
import { cleanup, render } from "@testing-library/react-native";
import SplashScreen from "../../screens/SplashScreen";

beforeAll((done) => {
  done();
});

afterAll((done) => {
  done();
});

let findTextElement = function (tree, element) {
  console.warn(tree);
  return true;
};

describe("<SplashScreen />", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<SplashScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("parking bot text element exists", () => {
    const { getByText } = render(<SplashScreen />);
    const text = getByText("Parking Bot");
    expect(text).toBeTruthy();
  });
});
