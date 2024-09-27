import React from 'react';
import { render } from '@testing-library/react-native';
import OpenLayersMap from '../OpenLayersMap';
import { WebView } from 'react-native-webview';

// Mock du composant WebView
jest.mock('react-native-webview', () => {
  const React = require('react');
  return {
    WebView: ({ onMessage }: { onMessage: (event: any) => void }) => {
      // Simuler l'appel de onMessage avec un markerId
      React.useEffect(() => {
        onMessage({ nativeEvent: { data: 'marker1' } });
      }, [onMessage]);
      return <></>;
    },
  };
});

describe('OpenLayersMap', () => {
  const mockOnMarkerPress = jest.fn();

  it('renders correctly', () => {
    const { toJSON } = render(
      <OpenLayersMap
        latitude={48.8566}
        longitude={2.3522}
        markers={[{ id: 'marker1', latitude: 48.8566, longitude: 2.3522 }]}
        onMarkerPress={mockOnMarkerPress}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('calls onMarkerPress with the correct marker ID', () => {
    render(
      <OpenLayersMap
        latitude={48.8566}
        longitude={2.3522}
        markers={[{ id: 'marker1', latitude: 48.8566, longitude: 2.3522 }]}
        onMarkerPress={mockOnMarkerPress}
      />
    );
    expect(mockOnMarkerPress).toHaveBeenCalledWith('marker1');
  });
});
