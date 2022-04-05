// // import dependencies
// import * as React from "react";

// // import react-testing methods
// import { render, fireEvent, waitFor, screen } from "@testing-library/react";

// // add custom jest matchers from jest-dom
// import "@testing-library/jest-dom";
// // the component to test
// import AdminHomeScreen from "../../screens/AdminHomeScreen";

// test("loads and display screen", () => {
//   render(<AdminHomeScreen />);
//   const admin_screen = screen.getByTestId("admin-safe-view");

//   // fireEvent.click(screen.getByText("Load Greeting"));
//   expect(getByTestId("admin-safe-view")).not.toBeNull();
//   // expect(admin_screen).toHaveTextContent("");
//   //   expect(admin_screen)
//   //   expect(screen.getByRole("button")).toBeDisabled();
// });

// test("test hello", () => {
//   expect(true).toBeTruthy();
// });

import React from "react";
import renderer from "react-test-renderer";

import AdminHomeScreen from "../../screens/AdminHomeScreen";

describe("<AdminHomeScreen />", () => {
  // it("has 1 child", async () => {
  //   const tree = renderer.create(<AdminHomeScreen />).toJSON();
  //   console.log("children length is");
  //   console.log(tree.children.length);
  //   // expect(tree.children.length).toBe(1);
  // });

  it("renders correctly", () => {
    const tree = renderer.create(<AdminHomeScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
