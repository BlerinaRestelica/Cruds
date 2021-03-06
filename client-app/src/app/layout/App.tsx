import { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Container} from 'semantic-ui-react'
import { IActivity } from '../models/activity';
//import { servicesVersion } from 'typescript';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
//import 'semantic-ui-css/semantic.min.css';

const App = () =>{
  const[activities, setActivities] = useState<IActivity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const[editMode, setEditMode] = useState(false);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setEditMode(false);
  };
  
  const handleOpenCreateFrom = () => {
    setSelectedActivity(null);
    setEditMode(true);
  }

  const handleCreateActivity = (activity: IActivity) => {
    setActivities([...activities, activity])
    setSelectedActivity(activity);
    setEditMode(false);
  }

  const handleEditActivity = (activity : IActivity) => {
    setActivities([...activities.filter(a=> a.id !== activity.id), activity])
    setSelectedActivity(activity);
    setEditMode(false);
  }

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(a => a.id !== id)])
  }

  useEffect(() => {
    axios
      .get<IActivity[]>('http://localhost:5000/api/activities')
      .then((response) => {
        let activities: IActivity[] =[];
        response.data.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
        })
        setActivities(activities);
      });
  }, []);

    return(
      <Fragment>
        <NavBar openCreateForm ={handleOpenCreateFrom}/>
        <Container style={{marginTop: '7em'}}>
          <ActivityDashboard 
          activities ={activities} 
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          />
        </Container>
      </Fragment>
    );
  };

export default App;