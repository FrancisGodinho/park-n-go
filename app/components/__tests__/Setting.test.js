import React from "react";
import renderer from "react-test-renderer";
import { cleanup } from "@testing-library/react-native";
import { fireEvent, render } from "@testing-library/react";
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
});
