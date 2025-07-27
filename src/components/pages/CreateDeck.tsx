import { CreateDeck as CreateDeckComponent } from '../CreateDeck';
import { NavigationProps } from '../../types';

export function CreateDeck(props: NavigationProps) {
  return <CreateDeckComponent {...props} />;
}