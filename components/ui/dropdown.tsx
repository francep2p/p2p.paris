import { useState, useRef, useEffect } from "react";

interface DropdownProps {
  Button: React.ComponentType<{ onClick: () => void; isOpen: boolean }>;
  DropDownComponent: React.ComponentType<{
    toggle?: () => void;
  }>;
}

export const Dropdown = ({ Button, DropDownComponent }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button onClick={toggleDropdown} isOpen={isOpen} />
      {isOpen && <DropDownComponent toggle={toggleDropdown} />}
    </div>
  );
};
