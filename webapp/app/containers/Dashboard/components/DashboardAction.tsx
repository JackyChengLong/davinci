/*
 * <<
 * Davinci
 * ==
 * Copyright (C) 2016 - 2017 EDP
 * ==
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * >>
 */

import * as React from 'react'
const Icon = require('antd/lib/icon')
const Tooltip = require('antd/lib/tooltip')
const Popover = require('antd/lib/popover')
const Popconfirm = require('antd/lib/popconfirm')
const styles = require('../Dashboard.less')
import {IProject} from '../../Projects'

interface IDashboardActionProps {
  currentProject: IProject
  depth: number
  item: {
    id: number,
    type: number,
    name: string
  }
  onInitOperateMore: (id: number, type: string) => any
  initChangeDashboard: (id: number) => any
}

interface IDashboardActionState {
  popoverVisible: boolean
}

export class DashboardAction extends React.PureComponent<IDashboardActionProps, IDashboardActionState> {
  constructor (props) {
    super(props)
    this.state = {
      popoverVisible: false
    }
  }

  private handleVisibleChange = (visible) => {
    this.setState({
      popoverVisible: visible
    })
  }

  private operateMore = (itemId, type) => (e) => {
    const { popoverVisible } = this.state
    const { onInitOperateMore } = this.props

    if (this.state.popoverVisible) {
      this.setState({
        popoverVisible: false
      })
    }
    onInitOperateMore(itemId, type)
  }

  public render () {
    const {
      currentProject,
      depth,
      item,
      initChangeDashboard
    } = this.props
    const { popoverVisible } = this.state

    const editAction = (
      <li onClick={this.operateMore(item.id, 'edit')}>
        <Icon type="edit" /> 编辑
      </li>
    )

    const moveAction = (
      <li onClick={this.operateMore(item.id, 'move')}>
        <Icon type="swap" className={styles.swap} /> 移动
      </li>
    )

    const ulActionAll = (
      <ul className={styles.menu}>
        {editAction}
        <li onClick={this.operateMore(item.id, 'copy')} className={item.type === 0 ? styles.popHide : ''}>
          <Icon type="copy" /> 复制
        </li>
        {moveAction}
        <li onClick={this.operateMore(item.id, 'delete')}>
          <Icon type="delete" /> 删除
        </li>
      </ul>
    )

    const ulActionPart = (
      <ul className={styles.menu}>
        {editAction}
        {moveAction}
      </ul>
    )

    const icon = (
      <Icon
        type="ellipsis"
        className={styles.itemAction}
        title="More"
      />
    )

    let ulPopover
    if (currentProject && currentProject.permission) {
      const currentPermission = currentProject.permission.vizPermission
      if (currentPermission === 0 || currentPermission === 1) {
        ulPopover = null
      } else {
        ulPopover = (
          <Popover
            placement="bottomRight"
            content={currentPermission === 2 ? ulActionPart : ulActionAll}
            trigger="click"
            visible={popoverVisible}
            onVisibleChange={this.handleVisibleChange}
          >
            {icon}
          </Popover>)
      }
    }

    const titleWidth = `${130 - 18 * depth}px`

    return (
      <span className={styles.portalTreeItem}>
        <Tooltip placement="right" title={`名称：${item.name}`}>
          {
            item.type === 0
              ? <h4 className={styles.dashboardTitle} style={{ width: titleWidth }}>{item.name}</h4>
              : <span className={styles.dashboardTitle} style={{width: titleWidth}} onClick={initChangeDashboard(item.id)}>
                  <Icon type="dot-chart" />
                  <span className={styles.itemName}>{item.name}</span>
                </span>
          }
          {ulPopover}
        </Tooltip>
      </span>
    )
  }
}

export default DashboardAction
