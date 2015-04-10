<#macro Include name solution="" webRes="" sysType="include">
<#if webRes=="">
	<#if solution=="">
		<#if name?starts_with("/")>
<#include "${tplBase}/${sysType}${name}"/>
		<#else>
<#include "${tplBase}/${sysType}/${name}"/>
		</#if>
	<#else>
<#include "${tplBase}/${sysType}/${solution}/${name}"/>
	</#if>
<#else>
	<#if solution=="">
<#include "${UserBase+webRes}/${sysType}${name}"/>
	<#else>
<#include "${UserBase+webRes}/${sysType}/${solution}/${name}"/>
	</#if>
</#if>
</#macro>