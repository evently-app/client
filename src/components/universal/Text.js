// export text component for different global styling
import React from "react";
import { Animated, Text } from "react-native";

/*

<Header>header text</Header>
<SubHeader>header text</SubHeader>
<Paragraph bold>paragraph text</Paragraph>

props {
	bold
	style (limit to position & color)
}

*/

const headerStyle = {
	fontSize: 20,
	fontWeight: "700",
	color: "white",
	fontFamily: "Avenir Next"
};

const subHeaderStyle = {
	fontSize: 16,
	fontWeight: "600",
	color: "white",
	fontFamily: "Avenir Next"
};

const paragraphStyle = {
	fontSize: 12,
	color: "white",
	fontFamily: "Avenir Next"
};

const Header = ({ animated, style, children }) => {
	if (animated)
		return <Animated.Text style={{ ...headerStyle, ...style }}>{children}</Animated.Text>;
	else return <Text style={{ ...headerStyle, ...style }}>{children}</Text>;
};

const SubHeader = ({ animated, style, children, pointerEvents }) => {
	if (animated)
		return (
			<Animated.Text pointerEvents={pointerEvents} style={{ ...subHeaderStyle, ...style }}>
				{children}
			</Animated.Text>
		);
	else
		return (
			<Text pointerEvents={pointerEvents} style={{ ...subHeaderStyle, ...style }}>
				{children}
			</Text>
		);
};

const Paragraph = ({ animated, style, children }) => {
	if (animated)
		return <Animated.Text style={{ ...paragraphStyle, ...style }}>{children}</Animated.Text>;
	else return <Text style={{ ...paragraphStyle, ...style }}>{children}</Text>;
};

export { Header, SubHeader, Paragraph };
