import { useState } from "react";
import Switch from "react-switch";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const ProfileSettings = () => {
  const { t } = useTranslation();

  // states for each toggle
  const [notifications, setNotifications] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Card className="max-w-md mx-auto p-4">
      <CardContent className="space-y-4">
        {/* Notifications */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {t("profileScreen.notifications")}
          </span>
          <Switch
            onChange={setNotifications}
            checked={notifications}
            height={18}
            width={36}
            handleDiameter={14}
            offColor="#d1d5db"   // gray-300
            onColor="#3b82f6"    // blue-500
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </div>

        {/* Data Sharing */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {t("profileScreen.dataSharing")}
          </span>
          <Switch
            onChange={setDataSharing}
            checked={dataSharing}
            height={18}
            width={36}
            handleDiameter={14}
            offColor="#d1d5db"
            onColor="#10b981"   // green-500
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </div>

        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {t("profileScreen.darkMode")}
          </span>
          <Switch
            onChange={setDarkMode}
            checked={darkMode}
            height={18}
            width={36}
            handleDiameter={14}
            offColor="#d1d5db"
            onColor="#111827"   // gray-900
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
