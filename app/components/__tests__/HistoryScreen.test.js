import React from "react";
import renderer from "react-test-renderer";
import { cleanup, render } from "@testing-library/react-native";
import { fireEvent } from "@testing-library/react";
import HistoryScreen from "../../screens/HistoryScreen";

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

describe("<HistoryScreen />", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<HistoryScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("welcome back text element exists", () => {
    const { getByText } = render(<HistoryScreen />);
    const text = getByText("Parking History");
    expect(text).toBeTruthy();
  });
});
