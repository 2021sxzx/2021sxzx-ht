import React from 'react'
import {HashRouter,Redirect,Route,Switch} from 'react-router-dom'
import Login from '../views/login/Login'
import PageContainer from '../views/PageContainer/PageContainer'

export default function indexRouter() {
  return (
    <HashRouter>
      <Switch>
        <Route path='/login' component={Login}></Route>
        <Route path='/' render={()=>
          <PageContainer></PageContainer>
        }>
        </Route>
      </Switch>
    </HashRouter>

  )
}