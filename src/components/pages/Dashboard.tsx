import { Dashboard as DashboardComponent } from '../Dashboard';
import { DashboardProps } from '../../types';

export function Dashboard(props: DashboardProps) {
  return <DashboardComponent {...props} />;
}