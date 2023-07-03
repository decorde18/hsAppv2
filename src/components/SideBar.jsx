import Button from './Button';
import styles from './SideBar.module.css';
function SideBar() {
  return (
    <aside className="ml-3 w-52 bg-gray1 px-2 pt-6 text-white">
      <div className="flex grow flex-col items-center justify-center gap-4">
        <Button type="sideNav">Print Roster</Button>
        <Button type="sideNav">Print Schedule</Button>
        <Button type="sideNav">Something</Button>
        <Button type="sideNav">Something</Button>
      </div>
    </aside>
  );
}

export default SideBar;
