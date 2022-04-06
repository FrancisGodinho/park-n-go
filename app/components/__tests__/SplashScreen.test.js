import React from "react";
import renderer from "react-test-renderer";
import { cleanup } from "@testing-library/react-native";
import { fireEvent, render } from "@testing-library/react";
import SplashScreen from "../../screens/SplashScreen";

let findTextElement = function (tree, element) {
  console.warn(tree);
  return true;
};

describe("<SplashScreen />", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<SplashScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
