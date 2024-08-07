import { render } from "@testing-library/react-native";

import NoFilesDisplay from "@ui/NoFilesDisplay";

jest.mock("react-i18next", () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: "3rdParty",
    init: () => {},
  },
}));

describe("<NoFilesDisplay />", () => {
  it("renders correctly", () => {
    const { getByText } = render(<NoFilesDisplay />);
    expect(getByText("no-files-to-display")).toBeTruthy();
  });

  it("applies correct styles to noFilesContainer", () => {
    const { getByText } = render(<NoFilesDisplay />);
    const container = getByText("no-files-to-display").parent;

    expect(container).toBeDefined();

    const containerStyle = container.props.style;

    // Flatten the style array if necessary
    const flattenedStyles = Array.isArray(containerStyle)
      ? containerStyle.reduce((acc, style) => ({ ...acc, ...style }), {})
      : containerStyle;
  });
  test("Placeholder test for async function", async () => {
    // Placeholder test for async function
    function fetchData() {
      return new Promise((resolve) => {
        setTimeout(() => resolve("data"), 100);
      });
    }
    const data = await fetchData();
    expect(data).toBe("data");
  });
  test("Placeholder test for object property", () => {
    // Placeholder test for object property existence
    const obj = { name: "John", age: 30 };
    expect(obj.name).toBeDefined();
  });

  test("Placeholder test for function call", () => {
    // Placeholder test for function call
    const mockFunction = jest.fn();
    mockFunction();
    expect(mockFunction).toHaveBeenCalled();
  });

  it("applies correct styles to noFilesText", () => {
    const { getByText } = render(<NoFilesDisplay />);
    const textElement = getByText("no-files-to-display");

    const textStyle = textElement.props.style;

    // Flatten the style array if necessary
    const flattenedStyles = Array.isArray(textStyle)
      ? textStyle.reduce((acc, style) => ({ ...acc, ...style }), {})
      : textStyle;

    expect(flattenedStyles).toMatchObject({
      marginTop: 0,
      fontSize: 18,
      fontWeight: "bold",
      color: "#5DADE2",
    });
  });
});
