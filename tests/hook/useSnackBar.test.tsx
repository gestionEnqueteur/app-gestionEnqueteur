
import useSnackBar from '../../hook/useSnackBar';
import { useStoreZustand } from '../../store/storeZustand';
import {renderHook} from "@testing-library/react-native";
import {act} from '@testing-library/react-native';

jest.mock('../../store/storeZustand', () => ({
  useStoreZustand: jest.fn()
}));

describe('useSnackBar', () => {
  const mockSetSnackBar = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useStoreZustand as jest.Mock).mockImplementation((selector) =>
      selector({ setMainSnackBarProp: mockSetSnackBar })
    );
  });

  it('should display a snackbar with default close action', () => {
    const { result } = renderHook(() => useSnackBar());

    act(() => {
      result.current({
        duration: 3000,
        children: 'Hello snackbar'
      });
    });

    expect(mockSetSnackBar).toHaveBeenCalledWith(expect.objectContaining({
      duration: 3000,
      children: 'Hello snackbar',
      visible: true,
      action: {
        label: 'Fermer',
        onPress: expect.any(Function),
      },
      onDismiss: expect.any(Function),
    }));
  });

  it('should use custom onDismiss if provided', () => {
    const mockOnDismiss = jest.fn();

    const { result } = renderHook(() => useSnackBar());

    act(() => {
      result.current({
        duration: 2000,
        children: 'Test',
        onDismiss: mockOnDismiss,
      });
    });

    const call = mockSetSnackBar.mock.calls[0][0];
    act(() => {
      call.onDismiss();
    });

    expect(mockOnDismiss).toHaveBeenCalled();
  });
});

