import React, { useEffect, useState } from 'react';
import {
  Form,
  FormGroup,
  TextInput,
  Checkbox,
  Popover,
  ActionGroup,
  Button
} from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';

import axios from 'axios';

/*
Steps:

1) Create a group under /api/rbac/v1/groups/ with the payload:

{
  "name": "GroupA",
  "description": "A description of GroupA"
}

2) Add user to group under /api/rbac/v1/groups/{uuid}/principals/ with the payload:

{
  "principals": [
    {
      "username": "smithj"
    }
  ]
}

3) Add role to group under /api/rbac/v1/groups/{uuid}/roles/ with the payload:

{
  "roles": [
    "94846f2f-cced-474f-b7f3-47e2ec51dd11"
  ]
}


4) [POST] Create Integrations under /api/integrations/v1.0/endpoints with the payload:
{
    "name": "Splunk Automation",
    "enabled": true,
    "type": "camel",
    "sub_type": "splunk",
    "description": "",
    "properties": {
        "url": "http://decd-187-3-186-244.ngrok.io",
        "disable_ssl_verification": false,
        "secret_token": "MYHEC_TOKEN",
        "basic_authentication": {},
        "extras": {}
    }
}

5) Create behavior group under /api/notifications/v1.0/notifications/behaviorGroups with the payload:

{
  "bundle_id":"35fd787b-a345-4fe8-a135-7773de15905e",
  "display_name":"Splunk-automation"
}

6) [POST] Update behavior group under api/notifications/v1.0/notifications/behaviorGroups/{BEHAVIOR_GROUP_ID}/actions with the payload:

  ["8d8dca57-1834-48dd-b6ac-265c949c5e60"] <<-- Id of the integration

7) [PUT] Update eventType under /api/notifications/v1.0/notifications/eventTypes/{EVENT_TYPE_UUID}/behaviorGroups with the payload:

["ff59b502-da25-4297-bd88-6934ad0e0d63"] <<- Behavior group ID
*/

const NOTIF_EVENTS_API = '/api/notifications/v1.0/notifications/events'
const RBAC_GROUPS_API = '/api/rbac/v1/groups/'
const RBAC_ROLES_API = '/api/rbac/v1/groups/{}/roles/'
const RBAC_ADD_USER_API = '/api/rbac/v1/groups/{}/principals/'
const CREATE_INTEGRATION_API = '/api/integrations/v1.0/endpoints'
const CREATE_BEHAVIOR_GROUP_API = '/api/notifications/v1.0/notifications/behaviorGroups'
const UPDATE_BEHAVIOR_GROUP_API = '/api/notifications/v1.0/notifications/behaviorGroups/{}/actions'
const EVENTTYPE_API = '/api/notifications/v1.0/notifications/eventTypes/{}/behaviorGroups'

const NOTIF_ADM_ROLE_UUID = '15f910ad-150a-46dd-b666-0b21088e9c55' // Stage UUID
const SPLUNK_GROUP_NAME = 'SPLUNK_INTEGRATION'
const SPLUNK_INTEGRATION_NAME = 'SPLUNK AUTOMATION'
const SPLUNK_BEHAVIOR_GROUP_NAME = 'SPLUNK AUTOMATION GROUP'
const BEHAVIOR_GROUP_BUNDLE_ID = '35fd787b-a345-4fe8-a135-7773de15905e'
const EVENT_TYPES_IDS_ARR = ["6d4d1e03-f1bf-427c-8c62-08a114242b5d", // policy-triggered
  "95a6d179-5dbd-4de4-a726-5bab2a699912",  // new-recommendation
  "5df33474-9cfd-40e9-9a86-9f8857147f89", // drift-baseline-detected
  "75233a10-646c-4e26-a5f1-639a7df8f29f"] // resolved-recommendation

const HEC = '404cc6e9-4ac7-4f9c-afae-a9387342363b'
const SPLUNK_INSTANCE_URL = 'http://ba97-187-3-186-244.ngrok.io'

const EventingAutomation = (location) => {

  const [notifData, setNotifData] = useState([])
  const [groupId, setGroupId] = useState('')
  let searchParams = new URLSearchParams(location.location.search);
  const [hecId, setHecId] = useState(searchParams.getAll('hecId')[0])
  const [splunkServerHostName, setHostName] = useState('')
  
  function handleHostInputChange(value){
    setHostName(value)
  }
  function createGroup() {

    return new Promise(function (resolve, reject) {
      axios.post(RBAC_GROUPS_API,
        {
          "name": SPLUNK_GROUP_NAME,
          "description": "This is a description"
        }).then((response) => {
          var result = response.data;
          console.log("Group created")
          resolve(result)
        },
          (error) => {
            console.log("Failed to create group")
            reject(error);
          }
        )
    })
  }

  async function addUserToGroup(groupId) {
    const username = await window.insights.chrome.auth.getUser().then(user => user.identity.user.username)
    console.log(username)
    return new Promise(function (resolve, reject) {
      axios.post(RBAC_ADD_USER_API.replace("{}", groupId),
        {
          "principals": [
            {
              "username": username
            }
          ]
        }).then((response) => {
          var result = response.data;
          console.log("User added to group")
          resolve(result)
        },
          (error) => {
            console.log("Failed to add user to group")
            reject(error)
          }
        )
    })
  }

  function addRoleToGroup(groupId) {
    return new Promise(function (resolve, reject) {
      axios.post(RBAC_ROLES_API.replace("{}", groupId),
        {
          "roles": [
            NOTIF_ADM_ROLE_UUID
          ]
        }
      ).then((response) => {
        var result = response.data;
        console.log("Added role to group")
        resolve(result)
      },
        (error) => {
          console.log("Failed to add role to group")
          reject(error)
        }
      )
    })
  }

  function createIntegration() {

    return new Promise(function (resolve, reject) {
      axios.post(CREATE_INTEGRATION_API, {
        "name": SPLUNK_INTEGRATION_NAME,
        "enabled": true,
        "type": "camel",
        "sub_type": "splunk",
        "description": "",
        "properties": {
          "url": splunkServerHostName,
          "disable_ssl_verification": true,
          "secret_token": hecId,
          "basic_authentication": {},
          "extras": {}
        }
      }).then((response) => {
        var result = response.data
        console.log("Created Integration")
        resolve(result)
      },
        (error) => {
          console.log("Failed to create integration")
          reject(error)
        }
      )
    })
  }

  function createBehaviorGroup() {
    return new Promise(function (resolve, reject) {
      axios.post(CREATE_BEHAVIOR_GROUP_API,
        {
          "bundle_id": BEHAVIOR_GROUP_BUNDLE_ID,
          "display_name": SPLUNK_BEHAVIOR_GROUP_NAME
        }).then((response) => {
          var result = response.data
          console.log("Created behavior group")
          resolve(result)
        },
          (error) => {
            console.log("Failed to create behavior group")
            reject(error)
          }
        )
    })
  }

  function associateIntegrationWithBehaviorGroup(behaviorGroupId, integrationId) {
    return new Promise(function (resolve, reject) {
      axios.put(UPDATE_BEHAVIOR_GROUP_API.replace('{}', behaviorGroupId), [integrationId]).then((response) => {
        var result = response.data
        console.log("Associated integration to behavior group")
        resolve(result)
      },
        (error) => {
          console.log("Failed to associate integration to behavior group")
          reject(error)
        }
      )
    })
  }

  function fetchBehaviorGroupsFromEventType(eventType) {
    return new Promise(function (resolve, reject){
      axios.get(EVENTTYPE_API.replace('{}', eventType))
        .then((response) => {
          var result = response.data
          console.log(result)
          resolve(result)
        },
          (error) => {
            console.log("Failed to fetch behavior groups")
            reject(error)
          }
        )
    })
  }

  function parseBehaviorGroups(data){
    var behaviorGroups = []
    data.forEach(group => behaviorGroups.push(group.id))
    return behaviorGroups
  }


  async function updateEventType(eventType, behaviorGroupsArr) {
      return new Promise(function (resolve, reject) {
        axios.put(EVENTTYPE_API.replace('{}', eventType), behaviorGroupsArr)
          .then((response) => {
            var result = response.data
            console.log("Updated Event type with behavior group")
            resolve(result)
          },
            (error) => {
              console.log("Failed to update event type with behavior group")
              reject(error)
            }
          )
      })
  }

  async function startAutomation() {
    var group = await createGroup()
    console.log(group.uuid)
    var userGroup = await addUserToGroup(group.uuid)
    console.log(userGroup)
    var roleGroup = await addRoleToGroup(group.uuid)
    console.log(roleGroup)
    var integration = await createIntegration()
    console.log(integration)
    var behavior = await createBehaviorGroup()
    console.log(behavior)
    var associatedBg = await associateIntegrationWithBehaviorGroup(behavior.id, integration.id)
    console.log(associatedBg)
    for(const eventType of EVENT_TYPES_IDS_ARR){
      const behaviorGroupsData = await fetchBehaviorGroupsFromEventType(eventType);
      console.log(behaviorGroupsData)
      var behaviorGroupsArr = parseBehaviorGroups(behaviorGroupsData)
      behaviorGroupsArr.push(behavior.id)
      var updatedEventType = await updateEventType(eventType, behaviorGroupsArr)
    }
    console.log("SETUP IS DONE!!")
  }

  return (
    <>
      <Form>
        <FormGroup
          label="Server hostname/IP Address and port (hostname:port)"
          labelIcon={
            <Popover
              headerContent={
                <div>
                  The server <b>hostname/IP Address</b> and <b>port</b> of your splunk HTTP Event Collector
                </div>
              }
              bodyContent={
                <div>
                  Usually the port is 8088
                  See {' '}
                  <a 
                  target='_blank'
                  href='https://docs.splunk.com/Documentation/Splunk/8.2.5/Data/UsetheHTTPEventCollector'>
                    Splunk HEC setup
                  </a>
                </div>
              }
            >
              <button
                type="button"
                aria-label="More info for name field"
                onClick={e => e.preventDefault()}
                aria-describedby="simple-form-name-01"
                className="pf-c-form__group-label-help"
              >
                <HelpIcon noVerticalAlign />
              </button>
            </Popover>
          }
          isRequired
          fieldId="simple-form-name-01"
        >
          <TextInput
            isRequired
            type="text"
            id="simple-form-name-01"
            name="simple-form-name-01"
            aria-describedby="simple-form-name-01-helper"
            value={splunkServerHostName}
            onChange={handleHostInputChange}
          />
        </FormGroup>
        <FormGroup
          label="Splunk HEC ID"
          fieldId="simple-form-name-01"
        >
          <TextInput
            isRequired
            type="text"
            id="simple-form-name-01"
            name="simple-form-name-01"
            aria-describedby="simple-form-name-01-helper"
            value={hecId}
            isDisabled
          />
        </FormGroup>
        <ActionGroup>
          <Button variant="primary"
          onClick={startAutomation}>
            Start Setup
          </Button>
        </ActionGroup>
      </Form>
    </>
  )
}

export default EventingAutomation;