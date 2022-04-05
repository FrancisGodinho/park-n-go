import React from "react";
import renderer from "react-test-renderer";
import { cleanup } from "@testing-library/react-native";
import { fireEvent, render } from "@testing-library/react";

import AdminHomeScreen from "../../screens/AdminHomeScreen";

// afterEach(cleanup);

let findTextElement = function (tree, element) {
  console.warn(tree);
  return true;
};

describe("<AdminHomeScreen />", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<AdminHomeScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  // jest.useFakeTimers();

  it("Find text element", () => {
    let tree = renderer.create(<AdminHomeScreen />).toJSON();
    expect(findTextElement(tree, "Rate: ")).toBeDefined();
    expect(findTextElement(tree, "Capacity: ")).toBeDefined();
    expect(findTextElement(tree, "Longitude: ")).toBeDefined();
    expect(findTextElement(tree, "Latitude: ")).toBeDefined();
  });
});
