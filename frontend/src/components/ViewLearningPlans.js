import {useEffect, useState} from 'react';
import axios from 'axios';

function ViewLearningPlans() {
    const [plans , setPlans] = useState([]);

    useEffect(() =>{
        axios.get('http://localhost:8080/api/learning-plans')
            .then((response) => {
                setPlans(response.data);
            }
            )
            .catch((error) => {
                console.error('Error fetching learning plans:', error);
            });

    } , [])

    return (
        <div>
          <h2>All Learning Plans</h2>
          {plans.length === 0 ? (
            <p>No learning plans available.</p>
          ) : (
            <ul>
              {plans.map(plan => (
                <li key={plan.id}>
                  <h3>{plan.title}</h3>
                  <p>{plan.description}</p>
                  <p>Created by User ID: {plan.createdByUserId}</p>
                  <p>Upvotes: {plan.upvotes}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      );

}
export default ViewLearningPlans;
// This component fetches and displays all learning plans from the backend API.