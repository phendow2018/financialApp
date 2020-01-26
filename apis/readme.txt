1:配置说明
{
	"LocalIp": "本机Ip地址",
	"HttpPort": Http访问端口号,
	"Database": {//监测系统数据库
		"Type": "数据库类型 此项目只支持 MSSQL",
		"ServerIp": "数据库地址",
		"User": "数据库用户名",
		"Password": "数据库密码",
		"DatabaseName": "数据库名"
	}
}

2:启动说明
	(1):环境需要64位Windows7及以上操作系统
	(2):开始程序执行start.bat
	(3):重启程序执行restart.bat
	(4):停止程序执行stop.bat

3:开机启动说明
	(1):给start.bat创建一个快捷方式，重命名为NetWorkManagement start
	(2):将快捷方式ControlWebApi start文件放到C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp中，即可实现开机自动启动