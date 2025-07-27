import { DeckView as DeckViewComponent } from '../DeckView';
import { StudyProps } from '../../types';

export function DeckView(props: StudyProps) {
  return <DeckViewComponent {...props} />;
}