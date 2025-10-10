import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { useNavigate } from "react-router-dom";
import { NavigationHookView, UserNavigationHookPresenter } from "../../presenter/UserNavigationHookPresenter";
import { useRef } from "react";

export const useUserNavigation = (featurePath: string,
presenterFactory: (view: NavigationHookView) => UserNavigationHookPresenter) => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();

  const view: NavigationHookView = {
    setDisplayedUser: setDisplayedUser,
    navigate: navigate,
    displayErrorMessage: displayErrorMessage
  }

    const presenterRef = useRef<UserNavigationHookPresenter | null>(null);
    if (!presenterRef.current) {
      presenterRef.current = presenterFactory(view);
    }

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        await presenterRef.current!.navigateToUser(event, authToken!, displayedUser, featurePath);

  };

  return navigateToUser;
};
