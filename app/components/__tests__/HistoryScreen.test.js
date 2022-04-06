import React from "react";
import renderer from "react-test-renderer";
import { cleanup } from "@testing-library/react-native";
import { fireEvent, render } from "@testing-library/react";
import HistoryScreen from "../../screens/HistoryScreen";

let findTextElement = function (tree, element) {
  console.warn(tree);
  return true;
};

describe("<HistoryScreen />", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<HistoryScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
