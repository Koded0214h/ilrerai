import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeAlert } from '../../store/slices/alertSlice';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function NotificationToast() {
  const dispatch = useAppDispatch();
  const { alerts } = useAppSelector((state) => state.alerts);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    alerts.forEach((alert) => {
      const timer = setTimeout(() => {
        dispatch(removeAlert(alert.id));
      }, 5000);
      timers.push(timer);
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [alerts, dispatch]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-center p-4 border rounded-lg shadow-lg max-w-sm ${getColors(alert.type)}`}
        >
          {getIcon(alert.type)}
          <span className="ml-3 text-sm font-medium flex-1">{alert.message}</span>
          <button
            onClick={() => dispatch(removeAlert(alert.id))}
            className="ml-2 hover:opacity-70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}