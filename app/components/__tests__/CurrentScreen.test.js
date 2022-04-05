import React from "react";
import renderer from "react-test-renderer";
import { cleanup, render } from "@testing-library/react-native";
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
  it.skip("renders correctly", () => {
    const tree = renderer.create(<CurrentScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it.skip("screen view exists", () => {
    const { getByTestId } = render(<CurrentScreen />);
    const item = getByTestId("screen-view");
    expect(item).toBeTruthy();
  });
});
