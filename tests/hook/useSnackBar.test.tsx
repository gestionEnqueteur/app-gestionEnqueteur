import { AllTheProviders } from "../test-utils";
import {
  act,
  render,
  renderHook,
} from "@testing-library/react-native";
import MainSnackBar from "../../components/MainSnackBar";
import useSnackBar from "../../hook/useSnackBar";
import { useStoreZustand } from "../../store/storeZustand";

jest.useFakeTimers();



describe("test useSnackBar", () => {
  const wrapper = AllTheProviders;
  
 test("La snackBar est bien cachée au démarrage", () => {
    const containerSnackbar = render(<MainSnackBar />, { wrapper });
    const result = containerSnackbar.queryByTestId("mainSnackBar");
    expect(result).toBeNull();
    expect(result).not.toBeOnTheScreen();
    expect(result).not.toBeVisible();
  });



  test("Le hook useSnack bar change bien le state", async () => {  
    const { result } = renderHook(() => {
      const snack = useSnackBar()
      const state = useStoreZustand(state => state.mainSnackBarProp)
      return { snack, state };
    }, {wrapper})
    expect(result.current.state.visible).toBe(false);
    act(() => {
      result.current.snack({ children: 'LOL' })
    })  
    expect(result.current.state.visible).toBe(true);
  });
});
