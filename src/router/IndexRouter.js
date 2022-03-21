import React, {useEffect, useState} from 'react'
import {HashRouter,Redirect,Route,Switch} from 'react-router-dom'
import Login from '../views/login/Login'
import PageContainer from '../views/PageContainer/PageContainer';

export default function indexRouter() {

  const [isPermitived, setIsPermitived] = useState(true);
  useEffect(() => {
    // 获取用户权限字段，比如业务员
    // 如果跟url不符合，就设置为false
    setIsPermitived(false);
  }, [])

  return (
    <HashRouter>
      <Switch>
        <Route path='/login' component={Login}></Route>
        <Route path='/' render={()=>
          isPermitived ? <Login /> :
          <PageContainer></PageContainer>
        }>
        </Route>
      </Switch>
    </HashRouter>

  )
}
