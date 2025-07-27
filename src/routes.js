// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Curriculum from "layouts/curriculum";
import Classes from "layouts/classes";
import Courses from "layouts/courses";
import ClassesTheory from "layouts/classes/theory";
import CourseTheory from "layouts/courses/theory";
import ClassQuiz from "layouts/classes/quiz";
import CourseQuiz from "layouts/courses/quiz";
import Payments from "layouts/payments";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";
import CourseModules from "layouts/courses/modules";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Curriculum",
    key: "curriculum",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/curriculum",
    component: <Curriculum />,
  },
  {
    type: "collapse",
    name: "Classes",
    key: "classes",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/classes",
    component: <Classes />,
  },
  {
    type: "collapse",
    name: "Course",
    key: "courses",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/courses",
    component: <Courses />,
  },
  {
    key: "quiz",
    route: "/classes/quiz/:topicId/:quizId",
    component: <ClassQuiz />,
    hidden: true, // This will hide it from the sidebar
  },
  {
    key: "course_quiz",
    route: "/courses/quiz/:moduleId/:quizId",
    component: <CourseQuiz />,
    hidden: true, // This will hide it from the sidebar
  },
  {
    name: "Theory",
    key: "theory",
    route: "/classes/theory/:id",
    component: <ClassesTheory />,
    hidden: true, // This will hide it from the sidebar
  },
  {
    name: "Course Theory",
    key: "course_theory",
    route: "/courses/theory/:id/:courseId",
    component: <CourseTheory />,
    hidden: true, // This will hide it from the sidebar
  },
  {
    name: "Course Modules",
    key: "course_modules",
    route: "/courses/modules/:id",
    component: <CourseModules />,
    hidden: true, // This will hide it from the sidebar
  },
  {
    type: "collapse",
    name: "Payments",
    key: "payments",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/payments",
    component: <Payments />,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "RTL",
    key: "rtl",
    icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    route: "/rtl",
    component: <RTL />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

export default routes;
