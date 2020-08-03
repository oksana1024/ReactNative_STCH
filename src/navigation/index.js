import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import pages from '../constants/pages';
import Loading from '../pages/loading';
import Welcome from '../pages/welcome';
import Login from '../pages/login';
import Signup from '../pages/signup/signup';
import PayTeaching from '../pages/signup/payForTeaching';
import PayLearning from '../pages/signup/payForLearning';
import Payment from '../pages/signup/payment';
import Finish from '../pages/signup/finish';
import HomeScreen from '../pages/home';
import MenuContent from '../pages/menu';
import LearnSubject from '../pages/learn';
import PhotoLibrary from '../pages/pLibrary';
import ProblemCrop from '../pages/imCrop';
import SearchSophist from '../pages/seSophist';
import ChooseSophist from '../pages/chSophist';
import SolveScreen from '../pages/thSolve';
import LearnSolve from '../pages/leSolve';
import TeachSubject from '../pages/teach';
import ChooseProblem from '../pages/chProblem';
import Camera from '../pages/camera';
import TeachHistory from '../pages/thHistory';
import LearnHistory from '../pages/leHistory';
import ChatScreen from '../pages/chat';
import LiveLearn from '../pages/liveLearn';
import Bank from '../pages/signup/bank';
import SubProblem from '../pages/subProblem';
import LearnStart from '../pages/learnStart';
import TeachStart from '../pages/teachStart';
import NotiStudent from '../pages/notiStudent';
import Payments from '../pages/payments';
import Banks from '../pages/banks';
import TransactionHistory from '../pages/transactionHistory';
import Transfer from '../pages/transfer';
import TransferStarted from '../pages/transferStarted';
import PaymentSetup from '../pages/paymentSetup';
import BankSetup from '../pages/bankSetup';
import Help from '../pages/help';
import Session from '../pages/session';
import PaymentEdit from '../pages/paymentEdit';
import BankEdit from '../pages/bankEdit';
import ChangeUserInfo from '../pages/changeUserInfo';
import TestScreen from '../pages/testPage';
import ForgotPassword from '../pages/forgotPassword';
import LearnMatches from '../pages/learnMatches';
import TeachMatches from '../pages/teachMatches';
import LeSessionNew from '../pages/leSessionNew';
import TeSessionNew from '../pages/teSessionNew';
import LeSession from '../pages/leSession';
import TeSession from '../pages/teSession';
import SessionAvailability from '../pages/sessionAvailability';
import LeSessionEnd from '../pages/leSessionEnd';
import TeSessionEnd from '../pages/teSessionEnd';
import ContentLoading from '../pages/contentLoading';
import { getWidth } from '../constants/dynamicSize';

const navigatorConfig = {
    defaultNavigationOptions: {
        header: null
    }
}

const LeSessionStack = createStackNavigator(
    {
        [pages.LEARN_MATCHES]: LearnMatches,
        [pages.LESESSION_NEW]: LeSessionNew,
        [pages.SESSION_AVAILABILITY]: SessionAvailability,
        [pages.LEARN_SESSION]: LeSession,
        [pages.CHAT_SCREEN]: ChatScreen,
        [pages.LESESSION_END]: LeSessionEnd
    },
    navigatorConfig
)

const TeSessionStack = createStackNavigator(
    {
        [pages.TEACH_MATCHES]: TeachMatches,
        [pages.TESESSION_NEW]: TeSessionNew,
        [pages.TEACH_SESSION]: TeSession,
        [pages.CHAT_SCREEN]: ChatScreen,
        [pages.TESESSION_END]: TeSessionEnd
    },
    navigatorConfig
)

const LeSubmitStack = createStackNavigator(
    {
        [pages.LEARN_SUBJECT]: LearnSubject,
        [pages.CAMERA]: Camera,
        [pages.PROBLEM_CROP]: ProblemCrop,
        // [pages.PROBLEM_SUBMITTED]: SubProblem
    },
    navigatorConfig
)

const LearnSwitch = createSwitchNavigator(
    {
        [pages.LESUBMIT_STACK]: LeSubmitStack,
        [pages.PROBLEM_SUBMITTED]: SubProblem
    },
    {
        initialRouteName: pages.LESUBMIT_STACK
    }
)

const TeChooseStack = createStackNavigator(
    {
        [pages.TEACH_SUBJECT]: TeachSubject,
        [pages.CHOOSE_PROBLEM]: ChooseProblem
    },
    navigatorConfig
)

const TeachSwitch = createSwitchNavigator(
    {
        [pages.TECHOOSE_STACK]: TeChooseStack
    },
    {
        initialRouteName: pages.TECHOOSE_STACK
    }
)

const MainSwitch = createSwitchNavigator(
    {
        [pages.LEARN_SWITCH]: LearnSwitch,
        [pages.TEACH_SWITCH]: TeachSwitch,
        [pages.LESESSION_STACK]: LeSessionStack,
        [pages.TESESSION_STACK]: TeSessionStack,
        [pages.CHANGE_USER_INFO]: ChangeUserInfo,
        [pages.BANK_EDIT]: BankEdit,
        [pages.HELP]: Help
    },
    {
        initialRouteName: pages.LEARN_SWITCH
    }
)

const MainDrawer = createDrawerNavigator(
    {
        [pages.CONTENT_LOADING]: ContentLoading,
        [pages.MAIN_SWITCH]: MainSwitch
    },
    {
        initialRouteName: pages.CONTENT_LOADING,
        contentComponent: MenuContent,
        drawerLockMode: 'locked-opened',
        edgeWidth: 0,
        overlayColor: 'rgba(0, 0, 0, 0.2)',
        drawerWidth: getWidth(303)
    }
);

const SignUpStack = createStackNavigator(
    {
        [pages.SIGN_UP]: Signup,
        [pages.BANK]: Bank
    },
    navigatorConfig
)

const SignInStack = createStackNavigator(
    {
        [pages.SIGN_IN]: Login,
        [pages.FORGOT_PASSWORD]: ForgotPassword
    },
    navigatorConfig
)

const AuthSwitch = createSwitchNavigator(
    {
        [pages.SIGNUP_SWITCH]: SignUpStack,
        [pages.SIGNIN_SWITCH]: SignInStack
    },
    {
        initialRouteName: pages.SIGNIN_SWITCH
    }
)

const RootNavigator = createSwitchNavigator(
    {
        [pages.LOADING]: Loading,
        [pages.AUTH]: AuthSwitch,
        [pages.APP]: MainDrawer,
    },
    {
        initialRouteName: pages.LOADING
    }
)

export const AppContainer = createAppContainer(RootNavigator);