import React from "react";
import renderer from "react-test-renderer";
import { cleanup } from "@testing-library/react-native";
import { fireEvent, render } from "@testing-library/react";
import CurrentScreen from "../../screens/CurrentScreen";

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

describe("<CurrentScreen />", () => {
  it("renders correctly", () => {
    //   const tree = renderer.create(<CurrentScreen />).toJSON();
    //   expect(tree).toMatchSnapshot();
  });
});
