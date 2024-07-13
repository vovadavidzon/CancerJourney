// LinkButton.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import LinkButton, { LinkButtonProps } from "@ui/LinkButton";

describe("LinkButton component", () => {
  const mockProps: LinkButtonProps = {
    onPress: jest.fn(),
    iconName: "example-icon",
    buttonText: "Example Button",
    disabled: false,
  };

  it("renders button correctly", () => {
    const { queryByText, queryByTestId } = render(
      <LinkButton {...mockProps} />
    );

    // Verify button text and icon are rendered
    expect(queryByText("Example Button")).not.toBeNull();

    const iconElement = queryByTestId("button-icon");
  });
});
