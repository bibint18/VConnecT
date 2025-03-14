import { useAppSelector } from "../redux/hooks"; // Ensure this is correctly set up

const DebugReduxState = () => {
  const user = useAppSelector((state) => state.user);

  console.log("Redux State:", user);

  return null; // Just for debugging
};

export default DebugReduxState;
