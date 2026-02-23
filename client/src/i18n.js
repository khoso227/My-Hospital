import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      hospital_name: "Hospital Pro",
      dashboard: "Dashboard",
      patients: "Patients List",
      add_new: "Add New Patient",
      doctors: "Doctors",
      appointments: "Appointments",
      labs: "Labs",
      pharmacy: "Pharmacy",
      billing: "Billing",
      logout: "Logout",
      search_placeholder: "Search by Name, Mobile or Caste...",
      admit_date: "Admit Date",
      remaining: "Remaining Amount"
    }
  },
  ur: {
    translation: {
      hospital_name: "ہسپتال پرو",
      dashboard: "ڈیش بورڈ",
      patients: "مریضوں کی فہرست",
      add_new: "نیا مریض شامل کریں",
      doctors: "ڈاکٹرز",
      appointments: "اپائنٹمنٹس",
      labs: "لیبز",
      pharmacy: "فارمیسی",
      billing: "بلنگ",
      logout: "لاگ آؤٹ",
      search_placeholder: "نام، موبائل یا ذات سے تلاش کریں...",
      admit_date: "داخلے کی تاریخ",
      remaining: "بقیہ رقم"
    }
  },
  sd: {
    translation: {
      hospital_name: "اسپتال پرو",
      dashboard: "ڊيش بورڊ",
      patients: "مريضن جي فهرست",
      add_new: "نئون مريض شامل ڪريو",
      doctors: "ڊاڪٽر",
      appointments: "اپائنٽمينٽس",
      labs: "ليب",
      pharmacy: "فارميسي",
      billing: "بلنگ",
      logout: "لاگ آئوٽ",
      search_placeholder: "نالو، موبائل يا ذات سان ڳولها ڪريو...",
      admit_date: "داخل ٿيڻ جي تاريخ",
      remaining: "باقي رقم"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;