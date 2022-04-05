import React from "react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import { cleanup, render } from "@testing-library/react-native";
import Settings from "../../screens/Settings";

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

describe("<Settings />", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Settings />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Settings text element exists", () => {
    const { getByText } = render(<Settings />);
    const text = getByText("Settings");
    expect(text).toBeTruthy();
  });
});
