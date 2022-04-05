import React from "react";
import renderer from "react-test-renderer";
import { cleanup, render } from "@testing-library/react-native";
import { fireEvent } from "@testing-library/react";

import AdminHomeScreen from "../../screens/AdminHomeScreen";

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

describe("<AdminHomeScreen />", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<AdminHomeScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it.skip("rate text element exists", () => {
    const { getByTestId } = render(<AdminHomeScreen />);
    const rate = getByTestId("rate-text");
    expect(rate).toBeTruthy();
  });

  it.skip("capacity text element exists", () => {
    const { getByTestId } = render(<AdminHomeScreen />);
    const capacity = getByTestId("capacity-text");
    expect(capacity).toBeTruthy();
  });

  it.skip("longitude text element exists", () => {
    const { getByTestId } = render(<AdminHomeScreen />);
    const longitude = getByTestId("longitude-text");
    expect(longitude).toBeTruthy();
  });

  it.skip("latitude text element exists", () => {
    const { getByTestId } = render(<AdminHomeScreen />);
    const latitude = getByTestId("longitude-text");
    expect(latitude).toBeTruthy();
  });
});
