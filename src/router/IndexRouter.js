import React from 'react'
import {HashRouter,Redirect,Route,Switch} from 'react-router-dom'
import Login from '../views/login/Login'
import PageContainer from '../views/page-container/PageContainer'

export default function indexRouter() {
  return (
    <HashRouter>
      <Switch>
        <Route path='/login' component={Login}></Route>
        <Route path='/' render={()=>
          localStorage.getItem("token")?
          <PageContainer></PageContainer>:
          <Redirect to="/login"></Redirect>
        }></Route>
      </Switch>
    </HashRouter>

  )
}
