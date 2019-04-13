import Enzyme, { shallow, render, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import renderer from "react-test-renderer";
// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

jest.mock("@mapbox/react-native-mapbox-gl");
jest.mock("react-native-permissions");

// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.render = render;
global.mount = mount;
global.renderer = renderer;
