// import {
//   anything,
//   capture,
//   instance,
//   mock,
//   spy,
//   verify,
//   when,
// } from "@typestrong/ts-mockito";
// import {
//   AppNavbarPresenter,
//   AppNavBarView,
// } from "../../src/presenter/AppNavBarPresenter";
// import { AuthToken } from "tweeter-shared";
// import { UserService } from "../../src/model.service/UserService";

// describe("AppNavBarPresenter", () => {
//   let mockAppNavBarPresenterView: AppNavBarView;
//   let appNavBarPresenter: AppNavbarPresenter;
//   let mockService: UserService;
//   const authToken = new AuthToken("abc", Date.now());

//   beforeEach(() => {
//     mockAppNavBarPresenterView = mock<AppNavBarView>();
//     const mockAppNavBarPresenterViewInstance = instance(
//       mockAppNavBarPresenterView
//     );
//     when(mockAppNavBarPresenterView.displayInfoMessage(anything(), 0)).thenReturn("messageId123");

//     const appNavBarPresenterSpy = spy(
//       new AppNavbarPresenter(mockAppNavBarPresenterViewInstance)
//     );
//     appNavBarPresenter = instance(appNavBarPresenterSpy);

//     mockService = mock<UserService>();
//     when(appNavBarPresenterSpy.service).thenReturn(instance(mockService));
//   });

//   test("tells the view to diplay a logging out message", async () => {
//     await appNavBarPresenter.logOut(authToken);
//     verify(
//       mockAppNavBarPresenterView.displayInfoMessage("Logging Out...", 0)
//     ).once();
//   });

//   test("calls logout on the user service with the correct auth token", async () => {
//     await appNavBarPresenter.logOut(authToken);
//     verify(mockService.logout(authToken)).once();

//     // let [capturedAuthToken] = capture(mockService.logout).last();
//     // expect(capturedAuthToken).toEqual(authToken);
//   });

//   test("tells the view to clear the info message that was displayed previously, clears the user info, and navigates to the login page when successful", async () => {
//     await appNavBarPresenter.logOut(authToken);
//     verify(mockAppNavBarPresenterView.deleteMessage("messageId123")).once();
//     verify(mockAppNavBarPresenterView.clearUserInfo()).once();
//     verify(mockAppNavBarPresenterView.navigate("/login")).once();

//     verify(mockAppNavBarPresenterView.displayErrorMessage(anything())).never();
//   });

//   test("tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page when unsuccessful", async () => {
//     let error = new Error("An error occurred");
//     when(mockService.logout(anything())).thenThrow(error);

//     await appNavBarPresenter.logOut(authToken);

//     let [errorString] = capture(
//       mockAppNavBarPresenterView.displayErrorMessage
//     ).last();
//     console.log(errorString);

//     verify(
//       mockAppNavBarPresenterView.displayErrorMessage(`Failed to log user out because of exception: ${error}`)).once();

//     verify(mockAppNavBarPresenterView.deleteMessage(anything())).never();
//     verify(mockAppNavBarPresenterView.clearUserInfo()).never();
//     verify(mockAppNavBarPresenterView.navigate("/login")).never();
//   });
// });
