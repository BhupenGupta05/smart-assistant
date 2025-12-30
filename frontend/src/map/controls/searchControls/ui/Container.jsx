import SearchControls from './SearchControls';
import {useSearchControlsLogic} from '../hooks/useSearchControlsLogic'

const Container = (props) => {
  const logic = useSearchControlsLogic(props);
  return <SearchControls {...props} {...logic} />;
};

export default Container;
