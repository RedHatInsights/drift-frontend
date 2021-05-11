import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedSystemNotification, { SystemNotification } from '../SystemNotification';

describe('SystemNotification', () => {
    let props;

    beforeEach(() => {
        props = {
            hasWritePermissions: true
        };
    });

    it('should render', () => {
        const wrapper = shallow(
            <SystemNotification { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('ConnectedSystemNotification', () => {
    let initialState;
    let mockStore;
    let props;

    beforeEach(() => {
        mockStore = configureStore();

        props = {
            permissions: {
                baselinesWrite: true
            }
        };

        initialState = {
            systemNotificationsState: {
                deleteNotificationsModalOpened: false,
                systemNotificationIds: [],
                systemNotificationLoaded: false,
                systemsToDelete: []
            },
            addNotifications: jest.fn(),
            toggleDeleteNotificationsModal: jest.fn(),
            setSystemsToDelete: jest.fn(),
            deleteNotifications: jest.fn(),
            getNotifications: jest.fn(),
            setSelectedSystemIds: jest.fn()
        };
    });

    it('should render correctly', () => {
        initialState.systemNotificationsState.systemNotificationLoaded = true;

        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedSystemNotification { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should disable Add system button', () => {
        initialState.systemNotificationsState.systemNotificationLoaded = true;
        props.permissions.baselinesWrite = false;

        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedSystemNotification { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
