import { useUnstableNativeVariable } from 'react-native-css-interop';
import { Platform, Text as RNText, TextInput as RNTextInput } from 'react-native';
import { variableToColor } from '@keyou-zzc/helper';
import { TextInput as TCTextInput } from '@keyou-zzc/treasure-chest';
import React from 'react';

function setTextNormalizationStyle(Component: React.ComponentType) {
  const Text = Component as typeof RNText & {
    render: (...args: any[]) => React.ReactElement;
    defaultProps: Partial<React.ComponentProps<typeof RNText>>;
  };

  Text.defaultProps = {
    allowFontScaling: false,
  };

  const oldTextRender = Text.render;

  Text.render = function (...args) {
    const origin = oldTextRender.call(this, ...args);

    const textColor = variableToColor(useUnstableNativeVariable('--foreground'));

    if (origin.type === 'RCTVirtualText') return origin;

    const children = origin.props.children;

    const cloneWithColor = (child: React.ReactNode) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, {
          style: [{ color: textColor }, (child.props as any).style],
        });
      }
      return child;
    };

    if (Array.isArray(children)) {
      const newChildren = children.map(cloneWithColor);
      return React.cloneElement(origin, {
        children: newChildren,
        style: [{ color: textColor }, origin.props.style],
      });
    }

    if (React.isValidElement(children)) {
      return React.cloneElement(origin, {
        children: cloneWithColor(children),
        style: [{ color: textColor }, origin.props.style],
      });
    }

    return React.cloneElement(origin, {
      style: [{ color: textColor }, origin.props.style],
    });
  };
}

function setTextInputNormalizationStyle(Component: React.ComponentType) {
  const TextInput = Component as typeof RNTextInput & {
    render: (...args: any[]) => React.ReactElement;
    defaultProps: Partial<React.ComponentProps<typeof RNTextInput>>;
  };

  TextInput.defaultProps = {
    allowFontScaling: false,
  };

  const oldTextInputRender = TextInput.render;

  TextInput.render = function (...args) {
    const origin = oldTextInputRender.call(this, ...args);
    const textColor = variableToColor(useUnstableNativeVariable('--foreground'));
    const defaultStyle = { color: textColor, allowFontScaling: false };

    return React.cloneElement(origin, {
      style: [defaultStyle, origin.props.style],
    });
  };
}

export function normalization(os?: (typeof Platform.OS)[]) {
  if (os && !os.includes(Platform.OS)) return;
  setTextNormalizationStyle(RNText);
  setTextInputNormalizationStyle(RNTextInput);
  setTextInputNormalizationStyle(TCTextInput);
}